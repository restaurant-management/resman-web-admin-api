const loadScriptFile = (src: string, withType?: boolean, id?: string) => {
    const tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    if (withType) { tag.type = 'text/javascript'; }
    if (id) {
        const element = document.getElementById(id);
        if (element) { element.appendChild(tag); }
    } else {
        document.getElementsByTagName('body')[0].appendChild(tag);
    }
};

export { loadScriptFile as LoadScriptFile };
