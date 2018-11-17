import * as React from 'react';
import IconButton from "@material-ui/core/IconButton/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";


interface MoreMenuState {
    anchorEl?: HTMLElement
}

interface MoreMenuProps {
    options: MenuOption[]

    onItemSelected(item: number)
}

interface MenuOption {
    id: number
    text: string
    icon: React.ReactElement<any>
}

export class MoreMenu extends React.Component<MoreMenuProps, MoreMenuState> {
    handleClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };
    handleClose = () => {
        this.setState({anchorEl: null});
    };
    handleItemSelected = (id: number) => {
        this.props.onItemSelected(id);
        this.handleClose();
    };

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        }
    }

    render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);
        const {options} = this.props;
        return (
            <span>
                <IconButton
                    aria-label="More"
                    aria-owns={open ? 'long-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}>
                    {options.map((option, id) => (
                        <MenuItem key={id} onClick={() => this.handleItemSelected(option.id)}>
                            <ListItemIcon>
                                {option.icon}
                            </ListItemIcon>
                            <ListItemText inset primary={option.text}/>
                        </MenuItem>
                    ))}
                </Menu>
            </span>
        )
    }
}
