import NavBar from "../components/NavBar";
import ImageUpload from "../components/ImageUpload";

import ButtonLink from "../components/ButtonLink";
import Descrtiption from "../components/Description";
import Keywords from "../components/Keywords";

export default function CreateExperience() {

  return (
    <>
      <NavBar />
      <h1>Create Experience page</h1>
      <div>
        <h1>Title</h1>
        <Descrtiption maxChars='60' varient="description-title" placeholder="e.g., Davis Farmers Market..."/>
      </div>
      <div>
        <h1>Description</h1>
        <Descrtiption maxChars='200' varient="description-default" placeholder="Enter experience description here..."/>
      </div>
      <div>
        <h1>Geolocation</h1>
        <div class='form-row'>
          <h1>Latitude</h1>
          <Descrtiption maxChars='8' varient="description-geolocation" placeholder="38.8951"/>
          <h1>Longitude</h1>
          <Descrtiption maxChars='8' varient="description-geolocation" placeholder="-77.0364"/>
        </div>
      </div>
      <div>
        <h1>Keywords</h1>
        <Keywords />
      </div>
      <div>
        <h1>Image</h1>
        <ImageUpload />
      </div>
      <ButtonLink varient="button-add" buttonName="Save" routeTo="/myExperiences" />
      <ButtonLink varient="button-back" buttonName="Cancel" routeTo="/myExperiences" />
    </>
  );
}
