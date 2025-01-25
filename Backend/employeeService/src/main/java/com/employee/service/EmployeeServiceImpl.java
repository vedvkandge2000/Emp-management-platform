package com.employee.service;

import com.employee.entity.Employee;
import com.employee.repository.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepo employeeRepo;

    @Override
    public List<Employee> getAllEmployees() {
        return (List<Employee>) employeeRepo.findAll();
    }


    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepo.findById(id).orElse(null);
    }


    @Override
    public Employee addEmployee(Employee employee) {
        return employeeRepo.save(employee);
    }


    @Override
    public Employee updateEmployee(Employee employee) {
        return employeeRepo.save(employee);
    }

    @Override
    public String deleteEmployee(Employee employee) {
        employeeRepo.delete(employee);
        return "employee successfully deleted for employee id:" + employee.getEmpId();
    }
}
