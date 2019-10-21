import React, { Component } from 'react';

export interface MulImagePickerProps {
    readonly label?: string;
    readonly onValueChange?: (images: string[]) => void;
}
export interface MulImagePickerState {
    readonly imageFiles: File[];
    readonly images: string[];
}

export default class MulImagePicker extends Component<MulImagePickerProps, MulImagePickerState> {
    constructor(props: MulImagePickerProps) {
        super(props);
        this.state = {
            imageFiles: [],
            images: []
        };
    }
    public render() {
        return (
            <div className='form-group'>
                <section className='tile transparent' id='superbox-gallery'>
                    <div className='tile-widget color transparent-black rounded-top-corners'>
                        <ul className='tile-navbar bg-transparent-black-3'>
                            <li>
                                <div className='check-transparent'>
                                    <label htmlFor='selectall' style={{ marginLeft: 10 }}>{this.props.label}</label>
                                </div>
                            </li>
                            <li className='filters'>
                                <span className='btn btn-green fileinput-button'>
                                    <i className='fa fa-plus'></i>
                                    <span> Add Images</span>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        multiple
                                        onChange={(e) => this._handleAddImages(e.target.files)}
                                    />
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className='tile-body color transparent-black superbox'>
                        {
                            this.state.images.map((value, index) => (
                                <div className='superbox-list img-view' style={{ width: '23%' }}>
                                    <img
                                        src={value}
                                        className='superbox-img'
                                        alt=''
                                    />
                                    <div className='overlay'>
                                        <div className='media-info'>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                {this.state.imageFiles[index].name}
                                            </span>
                                        </div>
                                        <button
                                            type='button'
                                            className='btn btn-default btn-xs dropdown-toggle'
                                            style={{ marginTop: 10 }}
                                            onClick={() => this._handleRemoveImage(index)}
                                        >
                                            <i className='fa fa-trash-o' style={{ fontSize: 20 }} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </section>
            </div>
        );
    }

    private _handleListImagesChange(imageFiles: File[]) {
        const images = this._listImageFileToListUrls(imageFiles);
        this.setState({
            imageFiles,
            images
        });

        if (this.props.onValueChange) {
            this.props.onValueChange(images);
        }
    }

    private _handleAddImages(files: FileList | null) {
        if (files !== null) {
            const imageFiles = this.state.imageFiles;

            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);

                if (file !== null) {
                    const idxDot = file.name.lastIndexOf('.') + 1;
                    const extFile = file.name.substr(idxDot, file.name.length).toLowerCase();

                    if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
                        imageFiles.push(file);
                    } else {
                        continue;
                    }
                }
            }

            this._handleListImagesChange(imageFiles);
        }
    }

    private _handleRemoveImage(index: number) {
        const imageFiles = this.state.imageFiles;

        imageFiles.splice(index, 1);

        this._handleListImagesChange(imageFiles);
    }

    private _listImageFileToListUrls(imageFiles: File[]): string[] {
        return imageFiles.map(imageFile => URL.createObjectURL(imageFile));
    }
}
