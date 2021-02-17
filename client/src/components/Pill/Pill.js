export default function Pill({ text, color }) {
    return (
        <span
            className={`inline-flex items-center cursor-default hover:text-white justify-center px-2 py-1 text-xs font-bold leading-none rounded-full text-red-100 bg-red-600 `}>
            {text}
        </span>
    );
}
