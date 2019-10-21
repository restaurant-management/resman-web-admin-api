import React, { Component } from 'react';

export interface ImagePickerProps {
    readonly label?: string;
    readonly name?: string;
}
export interface ImagePickerState {
    readonly image?: string;
}

export default class ImagePicker extends Component<ImagePickerProps, ImagePickerState> {
    constructor(props: ImagePickerProps) {
        super(props);
        this.state = {
            image: ''
        };
    }
    public render() {
        return (
            <div className='form-group'>
                <span className='btn btn-green fileinput-button'>
                    <i className='fa fa-plus'></i>
                    <span>{this.props.label}</span>
                    <input
                        type='file'
                        name={this.props.name}
                        accept='image/*'
                        onChange={(e) => this._handleImageChange(e.target.files)}
                    />
                </span>
                {
                    this.state.image ? (<div className='img-view' style={{ marginTop: 10 }}>
                        <img
                            src={this.state.image}
                            alt=''
                            style={{ height: 200 }} />
                    </div>) : null
                }
            </div>
        );
    }
    private _handleImageChange(files: FileList | null) {
        if (files !== null) {
            const file = files.item(0);
            if (file !== null) {
                const idxDot = file.name.lastIndexOf('.') + 1;
                const extFile = file.name.substr(idxDot, file.name.length).toLowerCase();
                if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
                    this.setState({
                        image: URL.createObjectURL(files.item(0))
                    });
                } else {
                    alert('Only jpg/jpeg and png files are allowed!');

                    return;
                }

                return;
            }
        }

        this.setState({
            image: ''
        });
    }
}
