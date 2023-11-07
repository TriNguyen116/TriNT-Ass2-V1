import React, { Component } from 'react';
import { View, Text, FlatList,ScrollView, Modal, Button, StyleSheet,TouchableOpacity, Alert } from 'react-native';
import { Card, Image, Icon, Rating, Input } from 'react-native-elements';
// import { ScrollView } from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';
// redux
import { connect } from 'react-redux';
import { postFavorite, postComment  } from '../redux/ActionCreators';

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  }
};
const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (id, dishId, author, comment, rating, date) => dispatch(postComment(id, dishId, author, comment, rating, date))
});

class ModalContent extends Component {
  render(){
    return (
      <View style={{ flex: 1, alignItems: 'center', marginTop: 60 }}>
            <Rating
              type="star"
              startingValue={this.props.rating}
              imageSize={40}
              showRating
              onFinishRating={(rating) => {this.props.onRatingChange(rating)}}
            /> 

            <Input
              
              placeholder="Author"
              // leftIcon={<Icon name="person" color="#7cc" size={35} />}
              leftIcon={{ type: 'font-awesome', name: 'user-o' }}
              onChangeText={text => this.props.onAuthorChange(text)} 
              value={this.props.author} 
            />

            <Input
              placeholder="Comment"
              // leftIcon={<Icon name="chat" color="#7cc" size={35} />}
              leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
              onChangeText={text => this.props.onCommentChange(text)} 
              value={this.props.comment}
            />

            <TouchableOpacity
              style={styles.submitButton}
              underlayColor="#fff"
              onPress={() => {this.props.handleComment();this.props.resetForm()}}
            >
              <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              underlayColor="#fff"
              onPress={() => {this.props.onPressClose();this.props.resetForm()}}
            >
              <Text style={styles.buttonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
    ) 
  }
  
}
class RenderDish extends Component {
  render() {
    const dish = this.props.dish;
    if (dish != null) {
      return (
        <Card>
          <Image source={{ uri: baseUrl + dish.image }} style={{ width: '100%', height: 100, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Image>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View style={{flexDirection:'row', justifyContent: 'center' }}>
            <Icon raised reverse type='font-awesome' color='#f50'
              name={this.props.favorite ? 'heart' : 'heart-o'}
              onPress={() => this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite()} />
            <Icon raised reverse type='font-awesome' color='#7cc' name={'pencil'}  onPress={()=>this.props.onPressPencil()} />    
          </View>
        </Card>
        
      );
    }
    return (<View />);     
  }
}

class RenderComments extends Component {
  render() {
    const comments = this.props.comments;
    return (
      <Card>
        <Card.Title>Comments</Card.Title>
        <Card.Divider />
        <FlatList data={comments}
          renderItem={({ item, index }) => this.renderCommentItem(item, index)}
          keyExtractor={(item) => item.id.toString()} />   
      </Card>
    );
  }
  renderCommentItem(item, index) {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating type='star' imageSize={12} startingValue={item.rating} style={{flexDirection:'row', paddingTop:5, paddingBottom:5}}/>
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  };
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // favorites: []
      showModal: false,
      rating: 5,
      author: '',
      comment: '',
    };
  }
  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter((cmt) => cmt.dishId === dishId);
    const favorite = this.props.favorites.some((el) => el === dishId);
    
    return (
      <ScrollView>
        <RenderDish dish={dish} favorite={favorite} 
          onPressFavorite={() => this.markFavorite(dishId)} 
          onPressPencil={() => this.onPressPencil()}/>
        <RenderComments comments={comments} />
        <Modal
          animationType="slide"
          visible={this.state.showModal}
        >
         <ModalContent
          showModal={this.state.showModal}
          handleComment={()=>this.handleComment()} 
          onPressClose={() => this.setState({ showModal: false })}
          resetForm={()=>this.resetForm()}
          rating = {this.state.rating}
          onRatingChange={(rating) => this.setState({ rating })}
          author={this.state.author}
          onAuthorChange={(author) => this.setState({ author })} 
          comment={this.state.comment}
          onCommentChange={(comment) => this.setState({ comment })}
         />
        </Modal>
      </ScrollView>
      
    );
  }
  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }  
  onPressPencil() {
    this.toggleModal();
  }
  handleComment() {
     console.log(JSON.stringify(this.state));
    const id = this.props.comments.comments.length;
    const date = new Date().toISOString();
    this.props.postComment(id, this.props.route.params.dishId, this.state.author, this.state.comment, this.state.rating, date);
    this.toggleModal();
  }
  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }
  resetForm() {
    this.setState({
        author: '',
        comment: '',
        rating: 5,
        showModal: false
    });
  }
}

const styles = StyleSheet.create(
  {
    submitButton:{
      marginRight:40,
      marginLeft:40,
      marginTop:10,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#7cc',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff',
      width: 400,
    },

    closeButton:{
      marginRight:40,
      marginLeft:40,
      marginTop:10,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#909497',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff',
      width: 400,
    },

    buttonText:{
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10,
        fontWeight: '600',
    }
  }
)


export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);