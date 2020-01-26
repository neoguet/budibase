
export const renderComponent = ({
    componentConstructor, uiFunctions,
    htmlElement, anchor, parentContext,
    componentProps}) => {

    const func = uiFunctions[componentProps._id];
    let component;
    let componentContext;
    const render = (context) => {
        
        if(context) {
            componentContext = {...componentContext};
            componentContext.$parent = parentContext;
        } else {
            componentContext = parentContext;
        }

        component = new componentConstructor({
            target: htmlElement,
            props: componentProps,
            hydrate:false,
            anchor
        });
    }

    if(func) {
        func(render, parentContext);        
    } else {
        render();
    }

    return ({
        context: componentContext,
        component
    });
}

