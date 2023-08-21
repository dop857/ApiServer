DOM=
    {
        CreateElement(tag,id,classs,style,parent)
        {
            let element=document.createElement(tag);
            element.setAttribute('id', id);
            element.setAttribute('class', classs);
            element.setAttribute('style', style);
            parent.appendChild(element);
            return element;
        }
    }
exports.DOM=DOM;