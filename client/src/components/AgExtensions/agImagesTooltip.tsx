import { ITooltipComp, ITooltipParams } from '@ag-grid-community/all-modules';

export class AgImagesTooltip implements ITooltipComp {
    private _gui: HTMLDivElement = document.createElement('div');

    public init(params: ITooltipParams) {
        this._gui.classList.add('image-tooltip');
        const image: HTMLImageElement = document.createElement('img');
        image.src = params.value[0];
        image.width = 200;
        image.height = 200;
        this._gui.appendChild(image);
    }

    public getGui(): HTMLElement {
        return this._gui;
    }
}
