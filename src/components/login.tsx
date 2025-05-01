import { FormEvent, useState, ChangeEvent, useEffect } from 'react'

interface Geo {
  lat: string
  lng: string
}

interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}

interface Company {
  name: string
  catchPhrase: string
  bs: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}

interface LoginRequest{
    name: string
    username: string

}


export default function Login(){
    const [backend, setBackend] = useState<User[]>([])
    const [userLogin, setUserLogin] = useState<LoginRequest>({ name: '', username: '' })
    const [loginState, setLoginState] = useState<boolean>(false)

    useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(json => setBackend(json))
    }, [])

    console.log(backend)
    console.log(loginState)

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        console.log('NOMBRE PUESTO EN EL INPUT' + userLogin.name)
        const exists = backend.some(
            user => user.name === userLogin.name && user.username === userLogin.username
        );
        if (exists) {
            setLoginState(true);
        } else {
            setLoginState(false);
        }
    }

    return(
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Ingrese su nombre</label>
                <input 
                    type="text" 
                    placeholder='Ingrese su nombre' 
                    value={userLogin.name}
                    onChange={e => setUserLogin(prev => ({ ...prev, name: e.target.value }))}/>
                <label htmlFor="">Ingrese su username</label>
                <input
                    type="text"
                    placeholder='Ingrese su username'
                    value={userLogin.username}
                    onChange={e => setUserLogin(prev => ({ ...prev, username: e.target.value }))}
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700 transition">
                        Agregar
                    </button>
            </form>
        </>
    )
}