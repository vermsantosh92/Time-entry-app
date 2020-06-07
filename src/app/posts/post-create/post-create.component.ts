import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  taskName = "";
  projectName = "";
  startTime = "";
  endTime = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  project = ['Titan', "Hanks", "Kodiak","Code Talkers","Project Blue Book","Durango"]
  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      taskName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      projectName: new FormControl('',
        { validators: [Validators.required] }),

      startTime: new FormControl(null, {
        validators: [Validators.required]
      }),
      endTime: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            taskName: postData.taskName,
            projectName: postData.projectName,
            startTime: postData.startTime,
            endTime: postData.endTime
          };
          this.form.setValue({
            taskName: this.post.taskName,
            projectName: this.post.projectName,
            startTime: this.post.startTime,
            endTime : this.post.endTime
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }


  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.taskName,
        this.form.value.projectName,
        this.form.value.startTime,
        this.form.value.endTime
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.taskName,
        this.form.value.projectName,
        this.form.value.startTime,
        this.form.value.endTime,

      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
