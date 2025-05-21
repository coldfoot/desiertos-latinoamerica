const menu_tipo_paisage = document.querySelector(".menu-tipo-paisage");

menu_tipo_paisage.addEventListener("click", e => {

    //console.log(e.target);

    const childDiv = e.target.closest('.menu-tipo-paisage > div');
    //console.log(childDiv);
    if (childDiv) {
        const dataAttr = childDiv.dataset.tipoPaisage; // replace 'data-your-attribute' with your actual data attribute name
        //console.log(dataAttr);

        // remove selected class to current "selected" element
        menu_tipo_paisage.querySelector(".tipo-paisage-selected").classList.remove("tipo-paisage-selected");

        // adds the selected class to the clicked div
        childDiv.classList.add("tipo-paisage-selected");

    }

})