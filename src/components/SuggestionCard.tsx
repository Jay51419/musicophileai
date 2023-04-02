const SuggestionCard = ({ text }: { text: string }) => {
    return <div className="bg-slate-950 px-6 py-9 max-w-[300px] flex items-center hover:bg-slate-900 duration-300 ">
        <span className="text-white text-lg text-left"> {text}</span>
        <svg className="text-white h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4l8 8-8 8" stroke="currentColor" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </div>
}

export default SuggestionCard;