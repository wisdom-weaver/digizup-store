import axios from 'axios'
const instance = axios.create({
    baseURL: 'https://us-central1-digizup-store-test1.cloudfunctions.net/api'
})
// const instance = axios.create({
//     baseURL: 'http://localhost:5001/digizup-store-test1/us-central1/api'
// })
export default  instance

// https://us-central1-digizup-store-test1.cloudfunctions.net/api
// http://localhost:5001/digizup-store-test1/us-central1/api
