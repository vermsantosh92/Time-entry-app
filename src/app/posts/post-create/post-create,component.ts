
import { PostService } from './../post.service';
import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {Post} from  '../post.model';
import { mimeType } from './mime-type.validator'


@Component({
      selector : 'post-create',
      templateUrl  : './post-create.component.html',
      styleUrls : ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
  enteredTitle = "";
  enteredContent = "";
  isLoading = false;
  post : Post;
  mode = 'create';
  private postId : string;
  form : FormGroup;
  imagePreview : string



constructor(public service : PostService , public route : ActivatedRoute){}

ngOnInit(){
   this.form = new FormGroup({
     title : new FormControl(null,{validators : [Validators.required, Validators.minLength(3)
    ]}),
    content : new FormControl(null, {validators : [Validators.required]}),
    image : new FormControl(null, {validators : [Validators.required], asyncValidators : [mimeType]})

   })

    this.route.paramMap.subscribe((paramMap : ParamMap)=>{
                if(paramMap.has('postId')){
                       this.mode = 'edit'
                       this.postId = paramMap.get('postId');
                       this.isLoading = true
                      this.service.getPost(this.postId).subscribe(postData=>{
                        this.isLoading = false
                          this.post = { id : postData._id, title : postData.title,
                             content : postData.content,
                              imagePath : postData.imagePath,
                              creater : postData.creater};
                          this.form.setValue({'title' :this.post.title, 'content' : this.post.content,image : this.post.imagePath})
                      })
                }
                else{
                  this.mode = 'create';
                  this.postId = null
                }
    })
}

onImagePicker(event : Event){
  const file = (event.target as HTMLInputElement).files[0];
  this.form.patchValue({image : file});
  this.form.get('image').updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = ()=>{
     this.imagePreview = reader.result as string;
  };
  reader.readAsDataURL(file)

}

  onSavePost(){
       if(this.form.invalid){
         return
       }

      this.isLoading = true
       if(this.mode = 'edit'){
        this.service.onAddPost(this.form.value.title,this.form.value.content,this.form.value.image)
       }
       else{
         this.service.updatePost(this.postId,this.form.value.title,this.form.value.content, this.form.value.image)
       }

         this.form.reset()
  }


}
