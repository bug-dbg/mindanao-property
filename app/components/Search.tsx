import { IconSearch } from "@tabler/icons-react";
import Select from "./Select";

const Search = ({ canBeInvisible }: { canBeInvisible: boolean }) => {
  const sticky = "sticky bottom-[0px] flex w-full py-10 px-32 items-center";

  return (
    <div className={canBeInvisible ? sticky : "flex w-max py-24 px-32 h-full"}>
      <div
        className={`w-1/8 bg-slate-50 py-5 px-5 rounded w-full shadow ${
          canBeInvisible ? "bg-opacity-75" : null
        }`}
      >
        <div className="mb-4 flex items-center">
          <p className="font-sans font-medium mr-2 text-2xl">Find a property</p>
          <IconSearch />
        </div>
        <div className="form-control flex flex-row space-x-4">
          <Select
            name="Location"
            options={
              <>
                <option>T-shirts</option>
                <option>Mugs</option>
              </>
            }
          />
          <Select
            name="Category"
            options={
              <>
                <option>T-shirts</option>
                <option>Mugs</option>
              </>
            }
          />
          <Select
            name="Property Type"
            options={
              <>
                <option>T-shirts</option>
                <option>Mugs</option>
              </>
            }
          />
          <button className="btn btn-primary w-40 text-accent">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Search;
