import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  threePeopleYouMayKnow: any[] = [];
  connectionsPosts: any[] = [];
  animatedReactions : any[] = [
    {imageUrl: '../../../assets/images/icons/like-squared.png', name: 'Like'},
    {imageUrl: '../../../assets/images/icons/celebrate-squared.png', name: 'Celebrate'},
    {imageUrl: '../../../assets/images/icons/support-squared.png', name: 'Support'},
    {imageUrl: '../../../assets/images/icons/love-squared.png', name: 'Love'},
    {imageUrl: '../../../assets/images/icons/insightful-squared.png', name: 'Insightful'},
    {imageUrl: '../../../assets/images/icons/funny-squared.png', name: 'Funny'},
  ]

  isReactionsVisible = false;
  commentsForPostId : number | null = null;
  hoveredPostId : number | null = null;
  hoveredCommentId : number | null = null;
  openCommentsIds: number[] = [];
  commentsToShowMap: { [key: number]: number } = {};
  clickedCommentReaction = '';
  postValue = ''
  posts : any[] = [];

  constructor(
    public userService : UserService,
    public postService : PostsService,
    private webSocketService : WebSocketService,
    public helperService : HelperService) {
    
  }

  ngOnInit(){
    this.userService.$peopleYouMayKnow.subscribe(res => {
      this.threePeopleYouMayKnow = [];
      this.threePeopleYouMayKnow.push(...res.slice(0, 3));
    });

    this.userService.$loggedUser.subscribe(res => {
      if(res && res.profileDetails){
        this.postService.getAllConnectionsAndUserPosts(this.userService.$loggedUser.value.id).subscribe((posts : any) => {
          if(Object.keys(posts).length > 0){
            this.connectionsPosts = posts;
            this.connectionsPosts.sort((a: any, b: any) => {
              return new Date(b.timePosted).getTime() - new Date(a.timePosted).getTime();
            });
            this.connectionsPosts.forEach(post => {
              if(post.comments){
                post.comments.sort((a: any, b: any) => {
                  return new Date(b.timeCommented).getTime() - new Date(a.timeCommented).getTime();
                });
              }
            });
            this.postService.$posts.next(posts);
          }
        });
      }
    });

    this.initWebSocketSubscriptions();
  }

  getPostedTimeAgo(value: Date) {
    if (!value) {
        return '';
    }

    const timePosted = new Date(value);
    const now = new Date();
    const secondsElapsed = Math.floor((now.getTime() - timePosted.getTime()) / 1000);

    const minutes = Math.floor(secondsElapsed / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (secondsElapsed < 60) {
        return 'less than a minute ago';
    } else if (minutes < 60) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    }
  }

  reactOnPost(post : any, reaction : any){   
    this.postService.reactOnPost({
      postId: post.id,
      userId: this.userService.$loggedUser.value.id,
      reactionType: reaction.name,
    }).subscribe(res => {
      post.reactions = res.reactions;
      post.numberOfReactions = res.numberOfReactions;
    });
  }

  getCommentsForPost(post: any) {
    if (!this.commentsToShowMap[post.id]) {
      this.commentsToShowMap[post.id] = 3;
    }
    if(post.comments){
      return post.comments.slice(0, this.commentsToShowMap[post.id]);
    }
  }

  showMoreComments(post: any) {
    this.commentsToShowMap[post.id] += 3;
  }

  showReactions(postId : number){
    this.hoveredPostId = postId;
  }

  hideReactions(){
    this.hoveredPostId = null;
  }

  showCommentReactions(commentId : number){
    this.hoveredCommentId = commentId;
  }

  hideCommentReactions(){
    this.hoveredCommentId = null;
  }

  reactOnComment(comment : any, post : any, reaction: any){
    this.postService.reactOnComment({
      userId: this.userService.$loggedUser.value.id,
      commentId: comment.id,
      postId: post.id,
      reactionType: reaction.name,
    }).subscribe(res => {

    });
  }

  showComments(postId: number) {
    const index = this.openCommentsIds.indexOf(postId);
    if (index > -1) {
      this.openCommentsIds.splice(index, 1);
      this.commentsToShowMap[postId] = 3;
    } else {
      this.openCommentsIds.push(postId);
    }
  }

  changeCommentReaction(commentReaction : string){
    this.clickedCommentReaction = commentReaction;
  }

  commentOnPost(event: KeyboardEvent, comment: string, post: any, commentInput: HTMLInputElement){
    if (event.key === 'Enter') {
      event.preventDefault();
      this.postService.commentOnPost({
        userId: this.userService.$loggedUser.value.id,
        postId: post.id,
        content: comment,
      }).subscribe(res => {
        commentInput.value = '';
      })
    }
  }

  isLiked(post : any){
    if(post.reactions){
      return post.reactions.some((reaction : any) => reaction.userId == this.userService.$loggedUser.value.id);
    }
  }

  hasPeopleToShow(){
    return this.threePeopleYouMayKnow.length > 0;
  }

  createPost(event : any, postValue : any){
    if(event.key === 'Enter'){
      this.postService.createPost({
        userId: this.userService.$loggedUser.value.id,
        content: postValue,
        image: '',
      }).subscribe(res => {
        this.postValue = ''
        this.posts = [];
        this.posts.push(this.postService.$posts.value);
        this.posts.push(res);
        this.postService.$posts.next(this.posts);
      });
    }
  }

  initWebSocketSubscriptions(){
    this.webSocketService.$newComment.subscribe(res => {
      if(Object.keys(res).length > 0){
        this.postService.$posts.value.forEach((post : any) => {
          if(post.id == res.UserPost.Id){
            if(!post.comments){
              post.comments = [];
            }
            post.comments.push({
              content: res.Content,
              id: res.Id,
              postId: res.PostId,
              timeCommented: res.TimeCommented,
              user: {
                id: res.User.Id,
                firstName: res.User.FirstName,
                lastName: res.User.LastName,
                imageUrl: res.User.ImageUrl,
                job: res.User.Job,
              },
              userId: res.User.Id,
            });
  
            post.comments.sort((a: any, b: any) => {
              return new Date(b.timeCommented).getTime() - new Date(a.timeCommented).getTime();
            });
          }
        });
      }
    })

    this.webSocketService.$postReaction.subscribe(res => {
      if(Object.keys(res).length > 0){
        let connectionPost = this.connectionsPosts.find((connectionPost : any) => connectionPost.id == res.UserPost.Id);
        let existingReaction = connectionPost.reactions.find((reaction : any) => reaction.id == res.Id);
        if(existingReaction){
          if(existingReaction.type.name == res.Type.Name){
            let index = connectionPost.reactions.findIndex((reaction : any) => reaction.id == existingReaction.id);
            connectionPost.reactions.splice(index, 1);
          } else {
            existingReaction.type = {
              id: res.Type.Id,
              iconUrl: res.Type.IconUrl,
              name: res.Type.Name
            }
            existingReaction.timeReacted = res.TimeReacted;
          }
        } else {
          connectionPost.reactions.push({
            id: res.Id,
            postId: res.PostId,
            timeReacted: res.TimeReacted,
            type: {
              id: res.Type.Id,
              iconUrl: res.Type.IconUrl,
              name: res.Type.Name
            },
            user: {
              firstName : res.User.FirstName,
              lastName: res.User.LastName,
              imageUrl: res.User.ImageUrl,
              job: res.User.Job,
            },
            userId: res.UserId
          })
          console.log(connectionPost.reactions);
        }
      }
    })

    this.webSocketService.$newPost.subscribe(res => {
      if(Object.keys(res).length > 0){
        this.connectionsPosts.push({
          comments: res.Comments,
          content: res.Content,
          id: res.Id,
          isEdited: res.IsEdited,
          postImage: res.PostImage,
          posterId: res.PosterId,
          reactions: res.Reactions,
          timePosted: res.TimePosted,
          user: {
            connections: res.User.Connections,
            firstName: res.User.FirstName,
            lastName: res.User.LastName,
            imageUrl: res.User.ImageUrl
          }
        });

        this.connectionsPosts.sort((a: any, b: any) => {
          return new Date(b.timePosted).getTime() - new Date(a.timePosted).getTime();
        });
      }
    });

    this.webSocketService.$newCommentReaction.subscribe(res => {
      if(res && Object.keys(res).length){
        let post = this.postService.$posts.value.find((posts : any) => posts?.comments?.some((comment : any) => comment.id == res.CommentId));
        let comment = post.comments.find((comment : any) => comment.id == res.CommentId);

        let reaction;

        if(comment.reactions){
          reaction = comment.reactions.find((reaction : any) => reaction.userId == res.UserId);
        }else{
          comment.reactions = [];
        }
  
        if(reaction){
          if(reaction.reactionType.name == res.ReactionType.Name){
            let index = comment.reactions.findIndex((reaction : any) => reaction.userId == this.userService.$loggedUser.value.id);
            comment.reactions.splice(index, 1);
          } else{
            reaction.reactionType = {
              iconUrl: res.ReactionType.IconUrl,
              name: res.ReactionType.Name,
              id: res.ReactionType.Id,
            };
            reaction.reactionTypeId = res.ReactionTypeId;
          }
        } else{
          comment.reactions.push({
            comment: res.Comment,
            commentId: res.CommentId,
            id: res.Id,
            reactionType: {
              iconUrl: res.ReactionType.IconUrl,
              name: res.ReactionType.Name,
              id: res.ReactionType.Id,
            },
            reactionTypeId: res.ReactionTypeId,
            user: res.User,
            userId: res.UserId,
          });
        }
      }
    });
  }
}
