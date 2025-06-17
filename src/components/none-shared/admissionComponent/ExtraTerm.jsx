import {useState} from "react";

function RenderTable() {
    return (
        <>
        </>
    )
}

function RenderDetailPopUp() {
    return (
        <>
        </>
    )
}

function RenderFormPopUp() {
    return (
        <>
        </>
    )
}

function RenderPage() {
    return (
        <>
        </>
    )
}

export default function ExtraTerm() {
    const [popUp, setPopUp] = useState({
        isOpen: false,
        type: '', // 'view' or 'update'
        term: null
    });

    const handleOpenPopUp = (type) => {
        setPopUp({...popUp, isOpen: true, type: type})
    }

    const handleClosePopUp = () => {
        setPopUp({...popUp, isOpen: false, type: ''})
    }


    return (
        <>
            <RenderPage

            />

            { popUp.isOpen && popUp.type === 'form' &&
                <RenderPage

                />
            }

            {
                <RenderPage

                />
            }

        </>
    )
}