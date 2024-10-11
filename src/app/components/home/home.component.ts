import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { PostsService } from '../../services/posts.service';

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
  hoveredPostId : number | null = null;

  constructor(public userService : UserService, public postService : PostsService) {
    
    
  }

  ngOnInit(){
    this.userService.$peopleYouMayKnow.subscribe(res => {
      this.threePeopleYouMayKnow.push(...res.slice(0, 3))
    });

    this.userService.$loggedUser.subscribe(res => {
      if(res){
        this.postService.getAllConnectionsPosts(this.userService.$loggedUser.value.id).subscribe(posts => {
          this.postService.$posts.next(posts);
        });
      }
    });
  }

  getPostedTimeAgo(value : Date){
    if (!value) {
      return '';
    }

    const timePosted = new Date(value);
    const now = new Date();
    const secondsElapsed = Math.floor((now.getTime() - timePosted.getTime()) / 1000);

    const minutes = Math.floor(secondsElapsed / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }
  }

  reactOnPost(post : any, reaction : any){   
    this.postService.reactOnPost({
      postId: post.posterId,
      userId: this.userService.$loggedUser.value.id,
      reactionType: reaction.name,
    }).subscribe(res => {
      console.log(res);
    });
  }

  showReactions(postId : number){
    this.hoveredPostId = postId;
  }

  hideReactions(postId : number){
    this.hoveredPostId = null;
  }

  commentOnPost(){

  }

  isLiked(post : any){
    return post.reactions.some((reaction : any) => reaction.userId == this.userService.$loggedUser.value.id);
  }
}
