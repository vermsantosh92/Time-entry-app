import { environment } from './../../environments/environment';
import { getTestBed } from '@angular/core/testing';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators'
import { Router } from '@angular/router';


@Injectable({
  providedIn : "root"
})

export class PostService{
 private  myPosts : Post[] = []
 private postSubject = new Subject <{posts : Post[], postCount : number}>()
 url = environment.apiUrl + "/api/posts";

 constructor(public http : HttpClient, private router : Router){}

    onGetPost(postPerPage : number, currentPage : number){
       const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`
        this.http.get<{message:string, post:any, maxPost : number}>(this.url + queryParams)
        .pipe(map((postData)=>{
          return {posts : postData.post.map(post=>{
            return{
              taskName : post.taskName,
              projectName : post.projectName,
              id : post._id,
              startTIme : post.startTIme,
              endTime : post.endTime

            }
          }), maxPosts : postData.maxPost}
        }))
        .subscribe((transformedPostData)=>{
               console.log(transformedPostData)
               this.myPosts =  transformedPostData.posts;
               this.postSubject.next({posts : [...this.myPosts], postCount : transformedPostData.maxPosts})
        })

    };

    getUpdatePost(){
      return this.postSubject.asObservable()
    };

    getPost(id:string){
        return this.http.get<{
          _id : string;
          taskName : string;
          projectName : string;
          startTime : string;
           endTime : string;
          }
           >(this.url +'/' + id)
    }

    onAddPost(taskName : string, projectName: string, startTime : string, endTime : string){

      // const post = { id : null ,title : title,content: content}
      const postData = new FormData();
      postData.append("taskName" , taskName)
      postData.append("projectName" , projectName),
      postData.append("startTime", startTime),
      postData.append("endTime", endTime),


         this.http.post<{message : string , post : Post}>(this.url,postData)
         .subscribe((res)=>{

            this.router.navigate(["/"])
         })

    };

    // updatePost(id:string,taskName : string, projectName : string, startTime :string, endTime : string){
    //     //  const post : Post = {id : id, title : title, content : content, imagePath : null}
    //      let postData : Post | FormData
    //     if(typeof(image)=== 'object'){
    //           postData = new FormData();
    //           postData.append("id",id)
    //          postData.append("title", title);
    //          postData.append("content", content);
    //          postData.append("image", image, title);

    //     }
    //     else{
    //           postData = {
    //            id : id ,
    //            title : title,
    //            content : content,
    //            imagePath : image,
    //            creater : null
    //          }
    //     }
    //      this.http.put(this.url + id ,postData)
    //      .subscribe(response=>{

    //        this.router.navigate(["/"])
    //      })
    // }

    onDeletePost(postId : string){
      return this.http.delete(this.url+'/'+ postId )

    }

}


