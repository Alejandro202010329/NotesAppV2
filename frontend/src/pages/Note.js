import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'
import { ReactComponent as SaveIcon } from '../assets/save.svg'


const Note = () => {
  let params = useParams()
  let noteId = params.id

  let navigate = useNavigate()


  let [note, setNote] = useState(null)

  useEffect(() => {
    if(noteId !== 'add') getNote()
  }, [noteId])


  let getNote = async () => {
    let response = await fetch(`http://127.0.0.1:8000/notes/${params.id}`)
    let data = await response.json()
    setNote(data)
  }

  let submitData = async (e) => {
    e.preventDefault()

    console.log('Submit data triggerd...')

    let url = '/notes'
    let method = 'POST'

    if (params.id !== 'add'){
        url = `http://127.0.0.1:8000/notes/${params.id}`
        method = 'PUT'
    }

    let noteBody = note?.body
    if (noteBody !== undefined){
      noteBody = String(noteBody).trim()
    }

    if(noteBody === '' || noteBody === undefined){
      alert('Note cannot be empty.')
      return 
    }

    await fetch(url, {
        method:method,
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({"body":noteBody})
    })

    navigate('/')
  }

  let deleteNote = async (e) => {
      e.preventDefault()
      await fetch(`http://127.0.0.1:8000/notes/${params.id}`, {method:'DELETE'})
      navigate('/')

  }

  return (
    <div className="note">
      <div className='note-header'>
        <h3>
            <Link to="/">
                <ArrowLeft />
            </Link>
        </h3>

        {noteId != 'add' && <button onClick={deleteNote}>Delete</button>}
      </div>

      <textarea onChange={(e) => { setNote({ ...note, 'body': e.target.value}) }} placeholder="Edit note" value={note?.body} required></textarea>

      <div onClick={submitData} className="floating-button">
            <SaveIcon  />
        </div>
    </div>
  )
}

export default Note