import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
    return (
        <div className="p-3 border-b border-[#e0dbdb] flex items-center justify-end max-w-8xl mx-auto w-full absolute top-0">
            <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white">
                <VideoIcon className="size-6" />
            </button>
        </div>
    );
}

export default CallButton;