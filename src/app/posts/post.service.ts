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
 url = "http://localhost:3000/api/posts"

 constructor(public http : HttpClient, private router : Router){}

    onGetPost(postPerPage : number, currentPage : number){
       const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`
        this.http.get<{message:string, post:any, maxPost : number}>(this.url + queryParams)
        .pipe(map((postData)=>{
          return {posts : postData.post.map(post=>{
            return{
              title : post.title,
              content : post.content,
              id : post._id,
              imagePath : post.imagePath,

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
          title : string;
          content : string;
          imagePath : string;
           creater : string;
          }
           >(this.url +'/' + id)
    }

    onAddPost(title : string, content: string, image : File){

      // const post = { id : null ,title : title,content: content}
      const postData = new FormData();
      postData.append("title" , title)
      postData.append("content" , content),
      postData.append("image", image, title)

         this.http.post<{message : string , post : Post}>(this.url,postData)
         .subscribe((res)=>{

            this.router.navigate(["/"])
         })

    };

    updatePost(id:string,title : string, content : string, image : File | string){
        //  const post : Post = {id : id, title : title, content : content, imagePath : null}
         let postData : Post | FormData
        if(typeof(image)=== 'object'){
              postData = new FormData();
              postData.append("id",id)
             postData.append("title", title);
             postData.append("content", content);
             postData.append("image", image, title);

        }
        else{
              postData = {
               id : id ,
               title : title,
               content : content,
               imagePath : image,
               creater : null
             }
        }
         this.http.put(this.url + id ,postData)
         .subscribe(response=>{

           this.router.navigate(["/"])
         })
    }

    onDeletePost(postId : string){
      return this.http.delete(this.url+'/'+ postId )

    }

}


