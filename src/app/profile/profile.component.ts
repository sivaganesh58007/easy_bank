import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Import DomSanitizer
import { error, log } from 'console';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing: boolean =false; 
  formdata: any={}
  // profilePicUrl: string = ''; // Store the image URL for display
  profilePicFile: File | null = null; // Store the file for upload
  profilePicUrl: String = ''; // Use SafeUrl type for sanitized URL
  constructor(private fb: FormBuilder, private profileService: ProfileService
    ,  private sanitizer: DomSanitizer // Inject DomSanitizer

  ) {}


  ngOnInit() {
    this.getProfileData();
  console.log(this.formdata)

  this.profileForm = this.fb.group({
      first_name: ['  '],//`${this.formdata.first_name}`
      last_name: [''],
      email: [''],
      phone_number: [''],
      date_of_birth: [''],
      address: ['']
    });
    this.profileForm.disable()
  }
  
  getProfileData() {
    this.profileService.getProfile().subscribe((profileData) => {
      this.formdata=profileData
      console.log(this.formdata)
      console.log(this.formdata.first_name)

      console.log('Profile data fetched successfully');
    console.log(this.formdata.first_name)
      this.profilePicUrl=profileData.profile_pic
    this.profileForm.patchValue({
          first_name: this.formdata.first_name,
          last_name: this.formdata.last_name,
          email: this.formdata.email,
          phone_number: this.formdata.phone_number,
          date_of_birth: this.formdata.date_of_birth,
          address: this.formdata.address
      });
    });
  } 




  
  enableEdit() {

    this.profileForm.enable()
    this.isEditing=true
    

    console.log(this.formdata.first_name) 
    this.profileForm.get('email')?.disable();

 
    


  }


  
  onSave() {
   try{
    if (this.profileForm.valid) {
      const formData = new FormData();
      Object.keys(this.profileForm.value).forEach((key) => {
        formData.append(key, this.profileForm.value[key]);
      });

      // If a profile picture file has been selected, append it to FormData
      if (this.profilePicFile) {
        formData.append('profile_pic', this.profilePicFile);
      }

      this.profileService.updateProfile(formData).subscribe(
        (response) => {
          this.isEditing = false;
          this.profileForm.disable();
          this.getProfileData()
        },
        (error) => {
          console.error('Error updating profile:', error);
        }
      );
    }
   }
   catch (error) {
    console.error('Unexpected error:', error);
  }
  }


  

}