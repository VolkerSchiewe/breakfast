import * as React from 'react';
import {style} from "typestyle";
import Dropzone from "react-dropzone";
import Grid from "@material-ui/core/Grid/Grid";
import Clear from "@material-ui/icons/Clear"
import Typography from "@material-ui/core/Typography/Typography";
import Avatar from "@material-ui/core/Avatar/Avatar";

interface UploadImageProps {
    imagePreview;

    handleImageChange;
    handleClearImage
}

const styles = {
    // container: style({
    //     maxWidth: "min-content",
    // }),
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
export const defaultImage = 'https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1'

export const UploadImage = ({imagePreview, handleImageChange, handleClearImage}: UploadImageProps) => (
    <Dropzone onDrop={handleImageChange} accept="image/*" multiple={false}
              className={styles.dropZone}>
        <Grid container direction={"column"} justify={"center"} alignItems={"center"}>
            <div className={styles.hoverContainer}>
                {defaultImage !== imagePreview &&
                <Clear className={styles.hover} fontSize={"large"} onClick={handleClearImage}/>
                }
                <Avatar src={imagePreview} className={styles.avatar}/>
            </div>
            <Typography variant={"button"} align={"center"}>Bild ändern</Typography>
        </Grid>
    </Dropzone>
)