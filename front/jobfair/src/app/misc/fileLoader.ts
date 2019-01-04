export class LoadedFile{
    content64:String;
    name:String;
    mime:String;
    contentMime?:String;
}
export class FileLoader{
    public static async loadFile(file:File):Promise<LoadedFile>{
        let reader=new FileReader();
        return new Promise<LoadedFile>((resolve, reject)=>{
            reader.onload=()=>{                
                resolve({content64:(String)(reader.result).split(",")[1], 
                name:file.name, 
                mime:file.type,
                contentMime:(String)(reader.result)});
            }
            reader.readAsDataURL(file);
        });
    }
}