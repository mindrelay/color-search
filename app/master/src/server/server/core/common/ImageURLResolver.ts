import {ImageDescriptor} from "../descriptors/Descriptors";
import ImageDTO from "../dto/ImageDTO";
import Settings from "../Settings";
const serverURL = Settings.global().serverUrl;

export default class ImageURLResolver {

    public static resolveURL(imageData: ImageDTO | ImageDescriptor , url: string): string {
        switch (imageData.source) {
            case "local": url = serverURL + "/" + imageData.url; break;
        }
        return url;
    }
}
