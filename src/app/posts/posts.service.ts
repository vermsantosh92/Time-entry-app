import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                taskName: post.taskName,
                projectName: post.projectName,
                id: post._id,
                startTime: post.startTime,
                endTime: post.endTime
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      taskName: string;
      projectName: string;
      startTime: string;
      endTime: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(taskName: string, projectName: string, startTime: string, endTime : string) {
    const postData = new FormData();
    postData.append("taskName", taskName);
    postData.append("projectName", projectName);
    postData.append("startTime", startTime);
    postData.append("endTime", endTime);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, taskName: string, projectName: string, startTime:string, endTime : string) {
    let postData: Post | FormData;
    // if (typeof image === "object") {
    //   postData = new FormData();
    //   postData.append("id", id);
    //   postData.append("taskName", taskName);
    //   postData.append("projectName", projectName);
    //   postData.append("startTIme", startTIme);
    //   postData.append("endTime", endTime);
    // } else {
      postData = {
        id: id,
        taskName: taskName,
        projectName: projectName,
        startTime: startTime,
        endTime: endTime
      };
    // }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }
}
