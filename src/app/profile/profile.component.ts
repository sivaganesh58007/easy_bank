import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing: boolean =true; 
  formdata: any={}

  constructor(private fb: FormBuilder, private profileService: ProfileService) {}


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
    

    console.log(this.formdata.first_name) 
    this.profileForm.get('email')?.disable();

 
    


  }


  onSave() {

    console.log(this.profileForm.value)
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.value).subscribe(
        (response) => {
          console.log('Profile updated successfully');
          
          
          this.profileForm.disable()


            },
        (error) => {
          if(error.status===400){
            alert('invalid date of birth')
          }
          console.error('Error updating profile:', error);
        }
      );
    }
  }
}
