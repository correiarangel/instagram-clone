import React, { Component } from 'react'
import io from 'socket.io-client'
import {FlatList ,StyleSheet, Image, View ,TouchableOpacity ,Text} from 'react-native'

import api from '../services/api';

import more from '../assets/more.png'
import like from '../assets/like.png'
import comment from '../assets/comment.png'
import send from '../assets/send.png'
import camera from '../assets/camera.png'

export default class Feed extends Component {
    
    static navigationOptions = ({navigation}) => ({
        headerRight: (
            <TouchableOpacity style={{marginRight: 20}} onPress={() => navigation.navigate('New')}>
                <Image source={camera}/>
            </TouchableOpacity>
        ),
    });

    //em react os comp. tem state
    // atravez dos stas setamos valores
    state = {
        //array vazio
        feed:[],
    }

    //em um componente class a cima reder 
    //local ideal para chamar a api
    async componentDidMount(){ 
        //chama metudo 
        this.registerToSocket()
       
        //busca lista de posts
        const response = await api.get('posts');
   
        this.setState({feed:response.data})
    }

    //metodo para atulizar post e likes
    registerToSocket = () => {
        
       const socket = io('http://192.168.1.25:3030');
     

        //percore a lista e retorna novo post em primeiro
        socket.on('post',newPost => {
           this.setState({feed:[newPost, ...this.state.feed]})     
        })

       // retorna os likes
        socket.on('like', likePost => {
            this.setState({
                feed: this.state.feed.map(post =>
                    post._id == likePost._id ? likePost: post
                )    
            })
        })
    }

    //função recebe id do poste e da like
    handleLike = id => {
        api.post(`/posts/${id}/like`)
    }
    
    render() {
        return(
            <View style={styles.container}>
                
                <FlatList data={this.state.feed}//recebe a lista
                keyExtractor={post => post._id}//passa os itens
                renderItem={({item}) => (

                    <View style={styles.feedItem}>
   
                        <View style={styles.feedItemHeader}>

                            <View style={styles.userInfo}>    
                                <Text style={styles.name}>{item.autor}</Text>
                                <Text style={styles.place}>{item.place}</Text>
                            </View> 
                    
                            <Image source={more}/>
                    
                        </View>   
                        <Image style={styles.feedImage} source={{ uri:`http://192.168.1.25:3030/file/${item.image}`}}/>

                        <View style={styles.feedItemFooter}>

                            <View style={styles.actions}>
                                
                                <TouchableOpacity style={styles.actions} onPress={() => this.handleLike(item._id)}>
                                    <Image source={like}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actions} onPress={() => {}}>
                                    <Image source={comment}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actions} onPress={() => {}}>
                                    <Image source={send}/>
                                </TouchableOpacity>    
                            </View>

                            <Text style={styles.likes}>{item.likes}:Curtidas</Text>
                            <Text style={styles.description}>{item.description} Descrição </Text>
                            <Text style={styles.Hashtags}>{item.hashtags}:Hashtags </Text>
                        </View>

                   </View>//feedItem
                    )}
                />
            </View>//view princ
        ) 
    }
}//fin class
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
        
    feedItem: {
        marginTop: 20
    },
        
        feedItemHeader: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
        },
        
        name: {
        fontSize: 14,
        color: '#000'
        },
        
        place: {
        fontSize: 12,
        color: '#666',
        marginTop: 2
        },
        
        feedImage: {
        width: '100%',
        height: 400,
        marginVertical: 15,
        },
        
        feedItemFooter: {
        paddingHorizontal: 15,
        },
        
        actions: {
        flexDirection: 'row'
        },
        
        action: {
        marginRight: 8
        },
        
        likes: {
        marginTop: 15,
        fontWeight: 'bold',
        color: '#000'
        },
        /*
        description: {
        marginTop: 15,
        likeHeight: 18,
        color: '#000'
        },
        */
        hashtags: {
        color: '#7159c1'
        }
})
