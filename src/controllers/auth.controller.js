export const register = (req, res) => {
  const { email, fullName, password } = req.body;
  try {

  } catch (error) {

  }
};

export const login = (req, res) => {
  res.send('Login');
};

export const logout = (req, res) => {
  res.send('Logout');
};
