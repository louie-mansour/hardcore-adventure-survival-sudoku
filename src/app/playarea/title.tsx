import { titleText } from "@/text";

export default function Title() {
  return (
    <div className="flex flex-row justify-center">
      <h1 className='title just-center text-3xl text-page-title-light'>{titleText}</h1>
    </div>
  )
}
