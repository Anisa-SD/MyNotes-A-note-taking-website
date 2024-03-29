import { useState } from "react";
import React from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host="http://localhost:5000"  
  const notesInitial=[]
  const [notes, setNotes]= useState(notesInitial)
//get all notes
const getNote=async()=>{
  console.log("in get notes")
  console.log(localStorage.getItem('token'))
  const response=await fetch(`${host}/api/notes/fetchallnotes`,{
    method:"GET",
    headers:{
    "Content-Type":"application/json",
    "Auth-Token": localStorage.getItem('token')
  }
});
const json=await response.json();
console.log(json)
setNotes(json)
}
    
//add a note
const addNote=async(title,description,tags)=>{
  //API Call
  const response=await fetch(`${host}/api/notes/addnotes`,{
    method:"POST",
    headers:{
    "Content-Type":"application/json",
    "Auth-Token": localStorage.getItem('token')
  },
  body:JSON.stringify({title,description,tags})
});
  const note=await response.json();
  setNotes(notes.concat(note))
}
//edit a note
const editNote=async(id,title,description,tags)=>{

  //API Call
  const response=await fetch(`${host}/api/notes/updatenotes/${id}`,{
    method:"PUT",
    headers:{
    "Content-Type":"application/json",
    "Auth-Token": localStorage.getItem('token')
  },
  body:JSON.stringify({title,description,tags})
});
// eslint-disable-next-line
const json=await response.json();
//console.log(json)
let newNote=JSON.parse(JSON.stringify(notes))
// logic to edit on client side
  for(let index=0;index<newNote.length;index++){
    const element=newNote[index];
    if(element._id===id){
      newNote[index].title=title;
      newNote[index].description=description;
      newNote[index].tags=tags;
      break;
    } 
  }
  setNotes(newNote);
}

//delete a note
const deleteNote=async(id)=>{
  const response=await fetch(`${host}/api/notes/deletenotes/${id}`,{
    method:"DELETE",
    headers:{
    "Content-Type":"application/json",
    "Auth-Token": localStorage.getItem('token')
  }
});
// eslint-disable-next-line
  const json=response.json()
  const newNotes=notes.filter((note)=>{return note._id!==id})
  setNotes(newNotes)
}
    return (
        <NoteContext.Provider value={{notes,getNote, addNote,editNote,deleteNote,setNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;