import React from 'react'
import SideBar from '../../common/SideBare'

const Chat = () => {


    return (
<div style={{ display: 'flex' }}>

<div style={{ flex: '0 0 20%', border:"1px solid red", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <SideBar />
</div>

<div style={{ flex: '1', minHeight:"100vh", border:"1px solid red", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    {/* Le reste de votre contenu ici */}
</div>

</div>




    )
}

export default Chat