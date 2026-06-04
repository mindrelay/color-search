import ImageDTO from "../dto/ImageDTO";

export default abstract class ImageSource {
    public async read(): Promise<ImageDTO[]> {
        let imageDtos = new Array<ImageDTO>();
        try {
            imageDtos = await this.getData();
        }catch (e) {
            console.log(e);
        }
        return imageDtos;
     }
    protected abstract async getData(): Promise<ImageDTO[]>;
}
