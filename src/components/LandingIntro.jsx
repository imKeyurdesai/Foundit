import TemplatePointers from "../components/TemplatePointers";

function LandingIntro() {
  return (
    <div className="hero min-h-full rounded-l-xl bg-base-200">
      <div className="hero-content py-4">
        <div className="max-w-md">
          <h1 className="text-3xl text-center font-bold ">
            Welcome to Found It
          </h1>

          <div className="text-center mt-12">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Foundit-Logo.svg/330px-Foundit-Logo.svg.png?20230214074642"
              alt="Dashwind Admin Template"
              className="w-48 inline-block"
            ></img>
          </div>

          {/* Importing pointers component */}
          <TemplatePointers />
        </div>
      </div>
    </div>
  );
}

export default LandingIntro;
