<template>
  <q-page class="flex flex-center">
    <h1>Test.vue</h1>
      <div class="row">
        <div class="col-12 q-my-lg">
          <q-card class=" q-pa-md">
            <button @click="takePhoto1">Tomar foto 1</button>
          </q-card>
        </div>
        <div class="col-12 q-my-lg">
          <q-card class=" q-pa-md">
            <button @click="takePhoto2">Tomar foto 2</button>
          </q-card>
        </div>
        <div class="col-12 q-my-lg">
          <q-card class=" q-pa-md">
            <button @click="takePhoto3">Tomar foto 3</button>
          </q-card>
        </div>
        <div class="col-12 q-my-lg q-pa-md">
          <q-card>
            <span>Input sencillo</span>
            <input type="file">
          </q-card>
        </div>
        <div class="col-12 q-my-lg">
          <q-card class=" q-pa-md">
            <span>Input forzando cámara</span>
            <input type="file" accept="image/*;capture=camera">
          </q-card>
        </div>
      </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { ref } from 'vue'
import { Camera, CameraResultType } from '@capacitor/camera';

export default defineComponent({
  name: 'Test',
  setup () {

    const takePhoto1 = async () => {
      let image = await Camera.getPhoto({
          quality: 100,
          allowEditing: false,
          resultType: CameraResultType.Uri
      });
      console.log(image)
    };

    const takePhoto2 = async () => {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });

      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      var imageUrl = image.webPath;

      // Can be set to the src of an image now
      imageElement.src = imageUrl;
    };

    const takePhoto3 = async () => {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      const fileName = new Date().getTime() + '.jpeg';
      const savedFileImage = await savePicture(photo, fileName);
      const newPhotos = [savedFileImage, ...photos];
      setPhotos(newPhotos);
    };

    return {
      takePhoto1, takePhoto2, takePhoto3
    };
  }
})
</script>
