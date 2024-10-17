import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';

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

  constructor(public userService : UserService, public postService : PostsService, private webSocketService : WebSocketService) {
    
    
  }

  ngOnInit(){
    this.userService.$peopleYouMayKnow.subscribe(res => {
      this.threePeopleYouMayKnow.push(...res.slice(0, 3))
    });

    this.userService.$loggedUser.subscribe(res => {
      if(res){
        this.postService.getAllConnectionsPosts(this.userService.$loggedUser.value.id).subscribe(posts => {
          this.connectionsPosts = posts;
          posts.forEach((post : any) => {
            post.comments.sort((a: any, b: any) => {
              return new Date(b.timeCommented).getTime() - new Date(a.timeCommented).getTime();
            });
          });
          this.postService.$posts.next(posts);
        });
      }
    });

    this.webSocketService.$newCommentReaction.subscribe(res => {
      let post = this.postService.$posts.value.find((posts : any) => posts.comments.some((comment : any) => comment.id == res.CommentId));
      let comment = post.comments.find((comment : any) => comment.id == res.CommentId);
      let reaction = comment.reactions.find((reaction : any) => reaction.userId == res.UserId);

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
    });
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
      console.log(res);
      post.reactions = res.reactions;
      post.numberOfReactions = res.numberOfReactions;
      console.log(post?.reactions[0]?.type?.iconUrl);
    });
  }

  getCommentsForPost(post: any) {
    if (!this.commentsToShowMap[post.id]) {
      this.commentsToShowMap[post.id] = 3;
    }
    return post.comments.slice(0, this.commentsToShowMap[post.id]);
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
    return post.reactions.some((reaction : any) => reaction.userId == this.userService.$loggedUser.value.id);
  }
}
