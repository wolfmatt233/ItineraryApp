import { useEffect, useState } from "react";

export default function SignUp() {
  return (
    <>
      <p>SignUp</p>
      <form>
        <label htmlFor="name">Username</label>
        <input type="text" name="name" id="name" />
        <label htmlFor="email">Email</label>
        <input type="text" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
      </form>
    </>
  );
}
