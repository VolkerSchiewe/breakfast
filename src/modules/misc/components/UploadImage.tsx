import * as React from "react";
import { useCallback, FC } from "react";
import { style } from "typestyle";
import Grid from "@mui/material/Grid/Grid";
import Clear from "@mui/icons-material/Clear";
import Typography from "@mui/material/Typography/Typography";
import Avatar from "@mui/material/Avatar/Avatar";
import { useDropzone } from "react-dropzone";

interface UploadImageProps {
  imagePreview;

  handleImageChange;
  handleClearImage;
}

const styles = {
  avatar: style({
    width: 100,
    height: 100,
  }),
  dropZone: style({
    margin: 10,
    cursor: "pointer",
  }),
  hoverContainer: style({
    position: "relative",
  }),
  hover: style({
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    background: "#0000008a",
    borderRadius: 50,
    color: "white",
  }),
};
export const defaultImage = "/static/images/placeholder.png";

export const UploadImage: FC<UploadImageProps> = ({
  imagePreview,
  handleImageChange,
  handleClearImage,
}) => {
  const onDrop = useCallback(handleImageChange, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <div {...getRootProps()} className={styles.hoverContainer}>
        {defaultImage !== imagePreview && (
          <Clear
            className={styles.hover}
            fontSize={"large"}
            onClick={handleClearImage}
          />
        )}
        <input {...getInputProps()} />
        <Avatar src={imagePreview} className={styles.avatar} />
        <Typography variant={"button"} align={"center"}>
          Bild ändern
        </Typography>
      </div>
    </Grid>
  );
};
