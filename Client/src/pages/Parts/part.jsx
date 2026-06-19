import React , { useState , useRef , useEffect} from "react";
import { usePart } from "../../context/partContext";
import"../dealer.css";

import {useToast} from "../../context/ToastContext";

const Part = ()=>{
    const [showModal,setShowModal]= useState(false);
    const handleOpen = ()=> setShowModal(true);
    const handleClose =()=> setShowModal(false);
    const { showToast } = useToast();

    const { parts , loading,  deletePart ,addPart , updatePart} = usePart();
        return(
            <>
            </>
        );

}
export default Part;