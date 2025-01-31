import Dropzone from "@/components/dropzone";

export default function Home() {
  return (
    <div className="pb-8 space-y-16">
    
      <div className="space-y-6">
        <h1 className="text-3xl font-medium text-center md:text-5xl">
          Free Unlimited File Converter with Free Convert
        </h1>
        <p className="text-center text-muted-foreground text-md md:text-lg md:px-24 xl:px-44 2xl:px-52">
          Introducing Free Convert – your go-to online tool for unlimited and free
          multimedia conversion. Easily convert images, audio, and videos
          without any restrictions. Start converting now and streamline your
          content effortlessly with Free Convert!
        </p>
      </div>
      <div className="space-y-6">      <center>  <p>&copy; 2025 Sagar Bhusal</p> </center>
</div> 

      <Dropzone />
    </div>
  );
}
