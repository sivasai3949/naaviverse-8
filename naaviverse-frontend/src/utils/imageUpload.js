import axios from 'axios';
import * as jose from 'jose';
import { predefinedToast } from './toast';

const secret = 'uyrw7826^&(896GYUFWE&*#GBjkbuaf'; // secret not to be disclosed anywhere.
const emailDev = 'pavithran@inr.group'; // email of the developer.

function renameFile(originalFile, newName) {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
}

const signJwt = async (fileName, emailDev, secret) => {
  try {
    const jwts = await new jose.SignJWT({ name: fileName, email: emailDev })
      .setProtectedHeader({ alg: 'HS512' })
      .setIssuer('gxjwtenchs512')
      .setExpirationTime('10m')
      .sign(new TextEncoder().encode(secret));
    return jwts;
  } catch (error) {
    console.log(error, 'kjbedkjwebdw');
  }
};

export const uploadImageFunc = async (e, setImage, setLoading) => {
  setLoading(true);
  const fileName = `${new Date().getTime()}${e.target.files[0].name.substr(
    e.target.files[0].name.lastIndexOf('.')
  )}`;
  const formData = new FormData();
  const file = renameFile(e.target.files[0], fileName);
  formData.append('files', file);
  const path_inside_brain = 'root/';

  const jwts = await signJwt(fileName, emailDev, secret);
  // console.log(jwts, 'lkjkswedcf');
  // let { data } = await axios.post(
  //   `https://drivetest.globalxchange.io/file/dev-upload-file?email=${emailDev}&path=${path_inside_brain}&token=${jwts}&name=${fileName}`,
  //   formData,
  //   {
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //     },
  //   }
  // );
  let { data } = await axios.post(
    `https://insurance.apimachine.com/insurance/general/upload`,
    formData,
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
  if (data?.length > 0) {
    console.log(data[0], 'dfile name upload');
    setImage(
      // (prev) => {
      // console.log(
      //   { ...prev, eachItem: data[0]?.originalname },
      //   "{ ...prev, eachItem: data[0]?.originalname }"
      // );
      // return { ...prev, [eachItem]: data[0]?.originalname };
      // }
      data[0]?.urlName
    );
    setLoading(false);
    return data[0]?.urlName;
  } else {
    predefinedToast('Error while uploading file');
    setLoading(false);
  }
  // console.log(data.payload.url, 'drive uploaded img');
  // setImage(data.payload.url);
  // setLoading(false);
};
