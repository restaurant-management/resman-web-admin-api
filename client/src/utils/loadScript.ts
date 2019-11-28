export const loadScriptFile = (src: string, withType: boolean = false) => {
    const tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    if (withType) { tag.type = 'text/javascript'; }
    document.getElementsByTagName('body')[0].appendChild(tag);
};
