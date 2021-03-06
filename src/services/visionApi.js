import axios from 'axios';

export function callVisionApi(fileName, imageBlobURL) {
  fetch(imageBlobURL).then(res => res.blob()).then(blob => {
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        var base64data = reader.result;
        // Remove data attributes
        getAnnotations(fileName, base64data.substr(base64data.indexOf(',') + 1));
    }
  });
}

async function getAnnotations(fileName, base64Image) {
  const url = "https://vision.googleapis.com/v1/images:annotate"
  const data = {
    "requests": [
      {
        "image": {
          "content": base64Image
        },
        "features": [
          {
            "type": "DOCUMENT_TEXT_DETECTION"
          }
        ]
      }
    ]
  }
  const config = {
    params: {
      key: process.env.REACT_APP_VISION_API_KEY
    }
  }

  axios.post(
    url,
    data,
    config
  ).then(response => {
    returnAsFile(fileName, response.data.responses[0].fullTextAnnotation.text);
  }).catch(error => {
    console.log(error);
  });
}

function returnAsFile(fileName, imageData) {
  const element = document.createElement("a");
  const file = new Blob([imageData], {type: 'text/plain;charset=utf-8'});
  element.href = URL.createObjectURL(file);
  element.download = fileName + ".txt";
  document.body.appendChild(element);
  element.click();
}