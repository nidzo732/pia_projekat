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
                let type=file.type;
                if(!type || type.length==0)
                {
                    type="application/octet-stream";
                }
                resolve({content64:(String)(reader.result).split(",")[1], 
                name:file.name, 
                mime:type,
                contentMime:(String)(reader.result)});
            }
            reader.readAsDataURL(file);
        });
    }
}