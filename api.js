const API = (() =>{
    const API_URL = "http://localhost:3000/courseList";


    const getList = async () => {
        const res = await fetch(API_URL);
        return await res.json();
    };

   
    return {
        getList,
    };
})();