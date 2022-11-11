import { useState } from "react";
import CameraIcon from "../icons/CameraIcon";
import CloseIcon from "../icons/CloseIcon";
import CorrectIcons from "../icons/CorrectIcons";
import UploadIcon from "../icons/UploadIcon";
import classes from "./Avatar.module.css";
const Avatar = ({ imgSrc, setImage, setImgSrc }) => {
  const [showImgUploaded, setImgUploader] = useState(false);
  const [saveImg, setSaveImg] = useState(false);
  const [imgName, setImageName] = useState("");

  const uploadImgHanlder = () => {
    setImgUploader(true);
  };

  const hideUploaderHandler = () => {
    setImgUploader(false);
  };

  const saveHandler = () => {
    setSaveImg(true);
    hideUploaderHandler();
  };

  //setbackground function
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ];
  function validFileType(file) {
    return fileTypes.includes(file.type);
  }
  function setBackGround(e) {
    let curFiles = e.target.files;

    for (const file of curFiles) {
      if (validFileType(file)) {
        let backgroundImg = URL.createObjectURL(file);
        setImgSrc(backgroundImg);
      }
    }

    setImageName(curFiles["0"].name);
  }
  const imageHandleChange = (e) => {
    setImage(e.target.files[0]);

    setBackGround(e);
  };
  return (
    <>
      {showImgUploaded && (
        <div className={classes.overlay} onClick={hideUploaderHandler} />
      )}
      {showImgUploaded && (
        <div className={classes.selectBox}>
          <span className={classes.close} onClick={hideUploaderHandler}>
            {" "}
            <CloseIcon />
          </span>
          <div className={classes.imgContainer}>
            <div className={classes.avatar}>
              {imgSrc !== "" ? (
                <img src={imgSrc} alt="avatar" />
              ) : (
                <div className={classes.border} />
              )}
            </div>
          </div>

          <div className={classes.actions}>
            <label htmlFor="image" type="button" className={classes.label}>
              Select Image
              <span className={classes.uploadIcon}>
                <UploadIcon />
              </span>
              <input
                type="file"
                id="image"
                name="file"
                onChange={imageHandleChange}
              />
            </label>
            <button
              type="button"
              className={classes.save}
              onClick={saveHandler}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className={classes.imgAction}>
        <button
          type="button"
          className={classes.uploadBtn}
          onClick={uploadImgHanlder}
        >
          <span>
            <CameraIcon />
          </span>
          Upload Profile Image
        </button>
        {imgName.trim() !== "" && saveImg && (
          <div className={classes.imgName}>
            <span>
              <CorrectIcons />
            </span>
            <p>{imgName}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Avatar;
