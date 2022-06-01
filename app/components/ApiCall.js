import AsyncStorage from "@react-native-async-storage/async-storage";

export const ApiCall = async(method,params,callback) => {
    const token = await AsyncStorage.getItem('token')
    console.log(params)
    var baseUrl = 'http://18.116.105.68:3001/' + method;
    fetch(baseUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization':token
        },
        body: JSON.stringify(params)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            callback({ data: responseJson })
        })
        .catch((error) => {
            callback({ data: error });
        });
}

export const ApiCallPut = async(method,params,callback) => {
    const token = await AsyncStorage.getItem('token')

    console.log(params)
   

       var baseUrl = 'http://18.116.105.68:3001/' + method;
      
    
    fetch(baseUrl, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization':token
        },
        body: JSON.stringify(params)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            callback({ data: responseJson })
        })
        .catch((error) => {
            callback({ data: error });
        });
}
export const ApiCallGet = async(method,callback) => {
    const token = await AsyncStorage.getItem('token')

     var baseUrl = 'http://18.116.105.68:3001/' + method;
      
    
    fetch(baseUrl, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization':token
        },

    })
        .then((response) => response.json())
        .then((responseJson) => {
            callback({ data: responseJson })
        })
        .catch((error) => {
            callback({ data: error });
        });
}














