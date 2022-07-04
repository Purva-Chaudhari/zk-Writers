import Link from "next/link";

export default function Register(){
    return(
    <div>
        <Link href="/">
                <button className="bg-red-600 hover:bg-red-800 text-white font-bold px-2 rounded ml-10 mt-10">
                  Go Back
                </button>
        </Link>
        
        <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.4.6/tailwind.min.css" rel="stylesheet" />

        <section className="hero container max-w-screen-lg mx-auto pb-10 mt-50 flex justify-center">
            <img  src="https://docs.microsoft.com/learn/achievements/register-and-manage-customer-devices-with-connected-field-service-social.png" alt="screenshot" ></img>
        </section>
    </div>
    );
}