import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { deleteCollection, getAllCollectionsWithoutTimelines} from '../api-services/collectionService';
import CreateCollection from './CreateCollection';
import { createCollection } from '../api-services/collectionService';

function Home() {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate()

  useEffect(()=>{
    const gettingCollections = async()=>{
      const {data} = await getAllCollectionsWithoutTimelines();
      setCollections([...data.data])
    }
    gettingCollections()
  }, [])

  const handleLogout = ()=>{
    localStorage.clear();
    return navigate("/login")
  }

  const handleCreateCollection = async(e)=>{
    e.preventDefault();
    const {title} = e.target;
    const collection = {title: title.value}

    // For instant ui change
    const tempCollections = [...collections];
    tempCollections.push(collection);
    setCollections(tempCollections);

    // Making changes to db
    await createCollection(collection);
    return navigate("/")
  }


  const handleCollectionDelete = async(collectionId)=>{
    // For instant ui change
    const tempCollections = collections.filter(c=>c._id!==collectionId);
    console.log(tempCollections)
    setCollections(tempCollections);

    // Changing in the db
    await deleteCollection(collectionId)
  }

  return (
    <div>
      <h1>Home</h1>
      {collections.map((c,index)=>(
        <div key={index}>
          <div className='timeline'>
            <a href={`/collections/${c._id}`}>{c.title}</a>
            <button onClick={()=>handleCollectionDelete(c._id)}>Delete</button>
            </div>
        </div>
      ))}
      <div style={{"marginBottom": "20px"}}></div>
      <CreateCollection handleCreateCollection={handleCreateCollection}/>
      <button style={{"display": "block", "margin": "20px"}} onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home